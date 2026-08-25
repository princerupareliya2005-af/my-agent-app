import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function POST(req: NextRequest) {
  try {
    const { action, owner, repo, diffs, token } = await req.json();

    const githubToken = token || process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        {
          success: false,
          error: `GitHub token missing. Please add a valid GitHub Personal Access Token (PAT) with repo scope in Settings ⚙️ to update ${owner}/${repo}.`,
        },
        { status: 401 }
      );
    }

    const octokit = new Octokit({ auth: githubToken });

    if (action === 'commitFix' && diffs && diffs.length > 0) {
      let updatedFiles: string[] = [];
      let lastCommitUrl = `https://github.com/${owner}/${repo}`;
      let commitError: string | null = null;

      for (const targetDiff of diffs) {
        const filePath = targetDiff.filePath;
        const content = targetDiff.fullCorrectedCode || targetDiff.patchedSnippet;

        try {
          // Determine default branch
          let branch = 'main';
          try {
            const { data: repoMeta } = await octokit.rest.repos.get({ owner, repo });
            branch = repoMeta.default_branch || 'main';
          } catch {}

          // Fetch current file SHA if it exists
          let sha: string | undefined = undefined;
          try {
            const { data: fileData } = await octokit.rest.repos.getContent({
              owner,
              repo,
              path: filePath,
              ref: branch,
            });
            sha = (fileData as any).sha;
          } catch {}

          // Create or update file contents on GitHub
          const encodedContent = Buffer.from(content).toString('base64');
          const updateRes = await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `fix(security): apply AI security patch to ${filePath}`,
            content: encodedContent,
            branch,
            sha,
          });

          updatedFiles.push(filePath);
          lastCommitUrl = updateRes.data.commit.html_url || `https://github.com/${owner}/${repo}/commit/${updateRes.data.commit.sha}`;
        } catch (fileErr: any) {
          console.error(`GitHub API commit failed for ${filePath}:`, fileErr.message);
          commitError = fileErr.message || 'Permission denied by GitHub API';
        }
      }

      if (updatedFiles.length > 0) {
        return NextResponse.json({
          success: true,
          owner,
          repo,
          prUrl: lastCommitUrl,
          message: `Successfully committed patch for ${updatedFiles.join(', ')} directly to ${owner}/${repo} on GitHub!`,
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: `GitHub update failed: ${commitError}. Please check write permissions or Personal Access Token in Settings ⚙️.`,
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ success: true, owner, repo });
  } catch (error: any) {
    console.error('Error in agent commit route:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
