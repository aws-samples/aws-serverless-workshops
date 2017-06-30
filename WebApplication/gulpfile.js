const gulp = require('gulp');
const gutil = require('gulp-util');
const print = require('gulp-print');
const awspublish = require('gulp-awspublish');
const parallelize = require('concurrent-transform');
const through = require('through2');
const path = require('path');

const REGIONS = [
    'ap-south-1',
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-southeast-2',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'us-east-1',
    'us-east-2',
    'us-west-2',
];

gulp.task('renderRegions', () => {
    gulp.src(['**/*.yaml', '!build/**/*.yaml'], { base: '..' })
        .pipe(print())
        .pipe(regionalize(REGIONS))
        .pipe(gulp.dest('build/templates'));
});

gulp.task('upload', () => {
    REGIONS.forEach((region) => {
        const publisher = awspublish.create({
            region: region,
            params: {
                Bucket: `wildrydes-${region}`,
            },
        });

        gulp.src(['1_StaticWebHosting/website/**'], { base: '..' })
            .pipe(parallelize(publisher.publish(), 10))
            .pipe(awspublish.reporter());

        gulp.src(`build/templates/${region}/**`)
            .pipe(publisher.publish())
            .pipe(awspublish.reporter());
    });
});

gulp.task('default', () => {
    gulp.src(['**/*.js', '!node_modules/**', '!**/vendor/**', '!**/website/js/vendor.js']).pipe(print());
});

function regionalize(regions) {
    const regionalizer = function regionalizer(file, enc, callback) {
        if (file.isNull()) {
            callback(null, file);
            return;
        }

        if (file.isStream()) {
            callback(new gutil.PluginError('multiRender', 'Streaming not supported'));
            return;
        }

        try {
            regions.forEach((region) => {
                const newFile = file.clone({
                    contents: false,
                });
                newFile.path = path.join(file.base, region, file.relative);
                newFile.contents = regionalizeContents(file.contents, region);
                this.push(newFile);
            });
        } catch (err) {
            console.log("Error in regionalize: " + err);
            callback(err, file.path);
        }

        callback();
    };
    return through.obj(regionalizer);
}

function regionalizeContents(contents, region) {
    return new Buffer(contents.toString().replace('us-east-1', region));
}
