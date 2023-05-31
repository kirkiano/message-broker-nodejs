
// IMPORTANT: See https://stackoverflow.com/a/70144428
// for bugginess in "Jest's glob implementation", as used in
// the 'testMatch' field of the following config (either explicitly
// or by default). This is why 'rootDir' is set explicitly below.
const config = {
    rootDir: '..',
    transform: {},
    verbose: true,
};

module.exports = config;