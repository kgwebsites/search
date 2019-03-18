const execFile = require('child_process').execFile;

function search({ dir, include, exclude, query }) {
  if (!dir || !query) throw new Error('dir and query required');

  return new Promise((res, rej) => {
    const args = ['-api', 'search', '-dir', dir, '-search', query];
    if (include) args.push('-include', include);
    if (exclude) args.push('-exclude', exclude);

    execFile(
      `${__dirname}/dewey/dewey`,
      args,
      { maxBuffer: 1024 * 100000000000 },
      function exe(error, stdout, stderr) {
        if (error) rej(new Error(error));
        if (stderr) rej(new Error(stderr));

        res(JSON.parse(stdout));
      }
    );
  });
}

const api = {
  search
};

module.exports = api;

// async function main() {
//   const results = await api
//     .search({ dir: './modules', query: 'File' })
//     .catch(e => console.error(e));

//   console.log(results);
// }
