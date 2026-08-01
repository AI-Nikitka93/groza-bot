const fs = require('fs');
const archiver = require('archiver');

const output = fs.createWriteStream('bot.zip');
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// append files from a sub-directory, putting its contents at the root of archive
archive.directory('dist/', 'dist');
archive.directory('public/', 'public');
archive.directory('src/', 'src');
archive.file('package.json', { name: 'package.json' });
archive.file('watchdog.js', { name: 'watchdog.js' });
archive.file('index.html', { name: 'index.html' });

archive.finalize();
