---
date: 2020-05-24T10:26:25+08:00
tags:
- drupal8
- site-building
title: "Revisiting Drupal 8 After 2 Years"
---
The last time I wrote about Drupal was 2017, when I built the company website for my friend's husband. It was a proper paid project, which really did come at a good time because I was about eight months fun-employed at the time trying to get [my own company](http://wismutlabs.com/) off the ground.

*Spoiler alert: the company still exists but more as a side-gig kind of thing.*

Almost three years later, I get a ping from him asking if I could help out with some tweaks because they had since moved their focus from machinery and machine parts to servicing and wanted to update the home page content.

In my mind, I was like, this shouldn't be too hard, I can totally do it in half an hour or something. So I told him I'd look into it. To be fair, I was not that far off in estimating the work specific to his requirements. Less than half an hour, in fact.

HOWEVER, everything before I could even get to that, was another story. A story, which I need to record down as notes to MYSELF, just in case I need to update the site again in a couple years… <span class="emoji" role="img" tabindex="0" aria-label="smirking face">&#x1F60F;</span>

## Some background, skip if you're bored

For some background, I did do a write-up of the project back then, but I clearly skipped over some steps that I most likely thought were trivial at the time.

Fast forward to today, I had already forgot so much of setting up Drupal on one's local machine, it was like a joke that wasn't remotely funny. But I guess muscle memory is a thing, because after a couple hours of troubleshooting, things kind of came back.

Or maybe it's just trauma. No, I'm just kidding.

I made an executive decision to host the website on [Pantheon](https://pantheon.io/) and this had proven to be a good decision. Very solid platform option for anyone who is still doing Drupal today.

Pantheon will apply updates every time there is a new one version of Drupal released but it is up to you to commit them. The workflow is also very good IMO as you're given a three environments, dev, test and live. They provide you easy one-click options to pull your database and files between environments.

## You mean you FORGOT how to setup locally?

The last time I looked at this site was (according to Git on Pantheon) 2 years ago when I updated to 8.4.2. Drupal had since moved on to 8.8.6, and there were 50 commits upstream (I think), when I first logged into the dashboard. Okay, no surprise there.

First pass, just update the thing and see if I get lucky. The odds of this are very very low, but because it was a development environment I could trash I just went ahead and forced the update. No surprise that the result was:

<img srcset="/assets/images/posts/sinvict-revisited/error-480.png 480w, /assets/images/posts/sinvict-revisited/error-640.png 640w, /assets/images/posts/sinvict-revisited/error-960.png 960w, /assets/images/posts/sinvict-revisited/error-1280.png 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/sinvict-revisited/error-640.png" alt="Generic error message on web page">

Right, I totally expected this. Local development it is. And then I realised I had forgotten ALL the things. I forgot the syntax for pointing to your database. I forgot what my SQL root password was (thank you, Keychain Access). I forgot how to recognise at first glance that PHP was not being used by Apache.

Several hours later…

I got some notes for future me.

1. If you see the contents of `index.php` printed verbatim on the screen, that means the web server is running fine but PHP is not.
2. Add a `settings.local.php` file for pointing to your Drupal database, and in it put this stuff:
    ```php
    <?php
    // Local development configuration.
    if (!defined('PANTHEON_ENVIRONMENT')) {
      // Database.
      $databases['default']['default'] = array(
        'database' => 'DATABASE_NAME',
        'username' => 'root',
        'password' => 'YOUR_PASSWORD_GO_FIGURE_IT_OUT',
        'host' => '127.0.0.1',
        'driver' => 'mysql',
        'port' => 3306,
        'prefix' => '',
      );
    }

    $settings['hash_salt'] = '$HASH_SALT';
    $settings['trusted_host_patterns'] = array(
      '^SITE_FOLDER_NAME_BECAUSE_DNSMASQ\.test',
      '^localhost$',
    );
    ```
3. Run `drush status` to see if things are wired up right. But if drush is throwing a million errors, add these troubleshooting bits into `index.php`
    ```php
    error_reporting(E_ALL);
    ini_set('display_errors', TRUE);
    ini_set('display_startup_errors', TRUE);
    ```

## When you haven't updated in a while…

After I figured out the PHP thing, I had 7.4 running. So once I got the site to load locally, I attempted an incremental update per minor version, just to try to figure out when the breaking change happened.

Even though the site loaded, I had this following error printed across the top of the site no matter where I went:

> Deprecated: Array and string offset access syntax with curly braces is deprecated in /Users/huijing/.composer/vendor/drush/drush/includes/sitealias.inc on line 174

But since the site was running, I assumed it would go away once I figured out how to update everything. Drush is a go-to tool for Drupal development for me, so there's a lot of me trying to run drush commands and getting a zillion lines of errors.

```bash
drush pm-updatestatus
```

I managed to get a list of modules that needed updating (it was all of them, come on, two years worth). But anyway, core updates first. When I got to 8.6.0, my “favourite” message showed up again.

Maybe it was a conflict with some of the installed modules. So I thought updating them might help, starting alphabetically with `admin_toolar`. Not the best idea, either.

> Unable to extract /tmp/drush_tmp_1590252134_5ec95266f2f6b/admin_toolbar-8.x-2.2.tar.gz. Unknown archive format.

Can I just say that Drupal troubleshooting is simply Googling the most relevant keywords you can think of? Apparently, the new way to update your Drupal modules is to use `composer`? I'm still on drush 8.1.5, so I don't know. But I did update all my composer stuff.

Anyway, I finally came across [this proposed solution](https://www.drupal.org/project/drush/issues/1721334#comment-13450560) in the drush issue log.

Solution: Add `application/gzip` to `drush_file_is_tarball()` in *drush/includes/drush.inc*. 

I tested on the most benign module I could find, which was **yearonly** and although it wasn't as benign as I thought it was, it worked. I didn't feel like asking more questions. The site was still very down.

The next module I tried to update was **token**. Bad idea.

> Drupal\Core\Extension\InfoParserException: Missing required keys (core) in modules/token/token.info.yml in
/Users/huijing/Sites/sinvict/core/lib/Drupal/Core/Extension/InfoParserDynamic.php:29 

At this point, I decided to downgrade to PHP7.2 after reading multiple issue threads that 7.2 is probably a better choice for compatibility reasons? Another thing I run regardless of whether I know it will work or not is:

```bash
drush cache-rebuild
```

Moar errors.

> Fatal error: Declaration of Drupal\page_manager_ui\Form\VariantPluginAddBlockForm::buildForm(array $form, Drupal\Core\Form\FormStateInterface $form_state, ?Symfony\Component\HttpFoundation\Request $request = NULL, $block_display = NULL, $block_id = NULL) must be compatible with Drupal\page_manager_ui\Form\VariantPluginConfigureBlockFormBase::buildForm(array $form, Drupal\Core\Form\FormStateInterface $form_state, $block_display = NULL, $block_id = NULL) in /Users/huijing/Sites/sinvict/modules/page_manager/page_manager_ui/src/Form/VariantPluginAddBlockForm.php on line 20

Moar Googling. I found that someone suggested running `composer require "twig/twig:1.37.1"` because, again, compatibility reasons.

At this point, it was way past midnight. My intelligence was in the toilet, so I went to bed.

## The next day…

I had reset the site so many times at this point that I decided to just bite the bullet and go up to 8.8.6 then figure shit out from there. Running `drush status` at this point gave me this:

> Symfony\Component\DependencyInjection\Exception\LogicException: Service 'page_manager.variant_route_filter' for consumer 'router.no_access_checks' does not implement Drupal\Core\Routing\FilterInterface. in /Users/huijing/Sites/sinvict/core/lib/Drupal/Core/DependencyInjection/Compiler/TaggedHandlersPass.php on line 164

Drush was clearly not working out. Out the window that went. Manual downloads! Unzipping and moving folders is not that hard. And I started with **page_manager** since it was the immediate error message I was seeing.

After updating a module, usually we have to update the database scheme accordingly. So I tried to run `drush updatedb`. Bad idea.

> Fatal error: Declaration of Drupal\panels\Form\PanelsAddBlockForm::buildForm(array $form, Drupal\Core\Form\FormStateInterface $form_state, ?Symfony\Component\HttpFoundation\Request $request = NULL, $tempstore_id = NULL, $machine_name = NULL, $block_id = NULL) must be compatible with Drupal\panels\Form\PanelsBlockConfigureFormBase::buildForm(array $form, Drupal\Core\Form\FormStateInterface $form_state, $tempstore_id = NULL, $machine_name = NULL, $block_id = NULL) in /Users/huijing/Sites/sinvict/modules/panels/src/Form/PanelsAddBlockForm.php on line 14

Fine, update **panels** next. Update database again…

> SQLSTATE[42S02]: Base table or view not found: 1146 Table 'sinvict.path_alias' doesn't exist: INSERT INTO {path_alias}

At least the error messages are changing. That's progress, right?

Moar Googling. The next problematic thing was **pathauto**. But because I tried to update the database a bunch of times at this point, things were screwed. So I nuked everything for the umpteenth time and updated core, page_manager, panels AND pathauto.

THEN, I ran `drush updatedb`.

ZOMG IT DID NOT FAIL <span class="emoji" role="img" tabindex="0" aria-label="loudly crying face">&#x1F62D;</span>

## Theme-related workflow updates

Out of everything I do on the web, the visual design and implementation of what people see and interact with on a page is the thing I love most. Custom theme creation was one of the things I specialised in during my Drupal career.

I had set up a workflow involving gulp and browsersync specially for Drupal theme development, but two years down the road, the gulpfile has to be written, among some other things.

Again, amnesia. I forgot that I had to enable the browsersync module on the site so the requisite script would be injected. Also, how you name your functions in the gulpfile matters. Don't use `sass` at the function name.

Anyway, this is what the full updated gulpfile looks like.

```javascript
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var concat      = require('gulp-concat');
var babel       = require('gulp-babel');
var cp          = require('child_process');

/**
 * Server functionality handled by BrowserSync
 */
function browserSyncServe(done) {
  browserSync.init({
    // Change as required, also remember to set in theme settings
    proxy: "sinvict.test",
    port: 5400
  })
  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

/**
 * @task sass
 * Compile files from scss
 */
function styles() {
  return gulp.src('_scss/styles.scss')
  .pipe(sass())
  .pipe(prefix(['last 3 versions', '> 1%', 'ie 8'], { cascade: true }))
  .pipe(gulp.dest('css'))
  .pipe(browserSync.reload({ stream: true }))
}

/**
 * @task scripts
 * Compile files from js
 */
function scripts() {
  return gulp.src(['_js/custom.js'])
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('js'))
  .pipe(browserSync.reload({ stream: true }))
}

/**
 * @task clearcache
 * Clear all caches
 */
function clearcache(done) {
  return cp.spawn('drush', ['cache-rebuild'], {stdio: 'inherit'})
  .on('close', done);
}

/**
 * @task reload
 * Refresh the page after clearing cache
 */
var reload = gulp.series(clearcache, browserSyncReload)

/**
 * @task watch
 * Watch scss files for changes & recompile
 * Clear cache when Drupal related files are changed
 */
function watchMarkup() {
  gulp.watch(['templates/*.html.twig', '**/*.yml'], reload)
}

function watchScripts() {
  gulp.watch(['_js/*.js'], scripts)
}

function watchStyles() {
  gulp.watch(['_scss/*.scss', '_scss/**/*.scss'], styles);
}

var compile = gulp.parallel(styles, scripts)
var serve = gulp.series(compile, browserSyncServe)
var watch = gulp.parallel(watchMarkup, watchScripts, watchStyles)

/**
 * Default task, running just `gulp` will 
 * compile Sass files, launch BrowserSync & watch files.
 */
gulp.task('default', gulp.parallel(serve, watch))
```

## Wrapping up

So, future me reading this, the next time you touch Drupal again, it might be a Drupal 9 project and none of this will be relevant any more. Who knows? But at least this time, you made it work.

<img src="/assets/images/posts/sinvict-revisited/nice-comment.jpg" srcset="/assets/images/posts/sinvict-revisited/nice-comment@2x.jpg 2x" alt="Satisfied stakeholder after all was done and dusted">
