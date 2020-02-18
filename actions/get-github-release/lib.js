const process = require('process')

// Third Party libraries
const core = require('@actions/core')
const github = require('@actions/github')
const tc = require('@actions/tool-cache')

/**
 * Fetches the latest release from `owner/repo` on GitHub that matches the
 * `matches` regular expression, and installs the binary to `installPath`. By
 * default the install path is `/tmp/<repo name>`. This function requires a valid
 * GitHub `token` that is able to read the repository.
 *
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository
 * @param {Regex} matches - The regex to match against the name pick the
 * specific asset in the release.
 * @param {string} token - A GitHub token, with `read` permissions on
 * the repository.
 * @param {string} [installPath='/tmp/${repo}'] - The path to install the binary.
 */
exports.getGitHubRelease = async function (owner, repo, matches, token, installPath = '/tmp/') {
  try {
    const octokit = new github.GitHub(token)

    // Retrieve first release that matched `regex` and download a tar archive of
    // the binary.
    const url = (await octokit.repos.getLatestRelease({ owner, repo }))
      .data
      .assets
      .find(asset => asset.name.match(matches))
      .browser_download_url

    const downloadPath = await tc.downloadTool(url)
    if (url.includes('7z')) {
      await tc.extract7z(downloadPath, installPath)
    } else if (url.includes('zip')) {
      await tc.extractZip(downloadPath, installPath)
    } else {
      await tc.extractTar(downloadPath, installPath)
    }

    core.setOutput('install_path', installPath)
    return installPath
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
