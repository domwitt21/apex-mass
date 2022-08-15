module.exports = {
    source: {
        include: ['./classes', './docs/typedefs.js'],
    },
    opts: {
        verbose: true,
        destination: './docs',
        readme: './README.md',
        template: './node_modules/better-docs',
    },
    plugins: [
        'plugins/markdown',
    ],
    templates: {
        search: true,
        'better-docs': {
            name: "ApexObj Reference",
            title: "ApexObj > ",
            hideGenerator: true,
            navLinks: [
                {
                    label: 'GitHub',
                    href: 'https://github.com/danfoy/apexobj',
                },
                {
                    label: 'npm',
                    href: 'https://www.npmjs.com/package/apexobj',
                },
            ],
        },
    },
};
