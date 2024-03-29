---
drupalfeed: true
date: "2017-07-30T00:00:00Z"
tags:
  - drupal8
  - site-building
title: "Drupal 101: Developing with Pantheon"
---

[Pantheon](https://pantheon.io/) is a website management platform that is known for specialised Drupal and Wordpress services. It offers various tiers of service depending on your particular use-case. Developers can utilise a free account for all the necessary development work and charges will only kick in after deploying to production.

While it is possible to do your development work entirely on your local machine then migrating the site to Pantheon, there are some slight configuration differences between hosting on Pantheon versus your own bare-metal server. I found it easier to just start off the process on Pantheon to begin with.

## All the basic stuff

1. Sign up for a Pantheon account.
   {{<img4w filename="posts/pantheon/register" filetype="jpg" alt="Register page on Pantheon">}}
2. This is how the dashboard looks like.
   {{<img4w filename="posts/pantheon/dashboard" filetype="jpg" alt="Dashboard page on Pantheon">}}
3. To make life easier, I strongly advise setting up your SSH keys. Click on the _Account_ tab and on the left navigation panel, you'll see _SSH Keys_. If you don't know how to generate SSH keys, there's [documentation available](https://pantheon.io/docs/ssh-keys/) for that complete with screenshots.
   {{<img4w filename="posts/pantheon/ssh" filetype="jpg" alt="Add SSH keys to account">}}
4. Once that's done, you can go back to the _Sites_ tab to create a new site. Enter the name of your site. Whatever you enter will end up being in the the URL. Custom domains are a possibility, but that's under the deploy-to-production, needs-to-be-paid-for part of things.
   {{<img4w filename="posts/pantheon/create" filetype="jpg" alt="Create new site on Pantheon">}}
5. Once your shiny new site is up, there'll be a site dashboard available to you. For the sake of this example, my site's name is _sinvict_. To set up the new site's database, click on the _Visit Development Site_ link and a new window will pop up with the Drupal new site set up page.
   {{<img4w filename="posts/pantheon/sitedash" filetype="jpg" alt="Set up Drupal database">}}
6. After you've gone through the initial setup, there will be a new commit on your site dashboard, which is for the updated `settings.php` file on the server itself.
   {{<img4w filename="posts/pantheon/dbsetup" filetype="jpg" alt="Set up Drupal database">}}
7. \*\*Optional step\*\* If like me, you like to use the command line for most things, you can install **Terminus**, Pantheon's CLI, using the following command:
   <pre><code class="language-bash">$ curl -O https://raw.githubusercontent.com/pantheon-systems/terminus-installer/master/builds/installer.phar && php installer.phar install</code></pre>
   or if you use [fish](https://fishshell.com/):
   <pre><code class="language-bash">$ curl -O https://raw.githubusercontent.com/pantheon-systems/terminus-installer/master/builds/installer.phar; and php installer.phar install</code></pre>

## Local development setup

Pantheon has provided some documentation on [how to get started with local development](https://pantheon.io/docs/local-development/), but there are some bits that I had to figure out myself. Regardless, the documentation is good, so do read it first. The following are my exact steps for doing it.

1. For local development, switch connection mode to Git.
   {{<img4w filename="posts/pantheon/gitmode" filetype="jpg" alt="Switch connection mode">}}
2. Clone your site into wherever you do site development.
   {{<img4w filename="posts/pantheon/clone" filetype="jpg" alt="Clone site to local machine">}}
3. Download a copy of the database. It will be compressed, so depending on your OS, unzip it, then import it into your local environment using your SQL client of choice.
{{<img4w filename="posts/pantheon/exportdb" filetype="jpg" alt="Export database">}}
I usually use drush for this (also, my shell is fish):
<pre><code class="language-bash">eval (drush sql-connect) < /Users/huijing/Desktop/sinvict_dev_2017-07-30T04-45-31_UTC_database.sql</code></pre>
4. Make a copy of the `example.settings.local.php` file, which can be found in the _sites_ folder, and put it in the _default_ folder. Your database configuration should be set up in here. Add it to the bottom of the file. Refer to the [documentation for configuring settings.php](https://pantheon.io/docs/settings-php/) from Pantheon for further clarification.
   <pre><code class="language-php">// Local development configuration.
   if (!defined('PANTHEON_ENVIRONMENT')) {
     // Database.
     $databases['default']['default'] = array(
       'database' => 'DATABASE',
       'username' => 'USERNAME',
       'password' => 'PASSWORD',
       'host' => 'localhost',
       'driver' => 'mysql',
       'port' => 3306,
       'prefix' => '',
     );
   }
   $settings['hash_salt'] = '$HASH_SALT';</code></pre>
   If your status report keeps telling you your configuration files are not protected, make sure the following line in the `settings.local.php` file gets commented out ([explanation here](https://www.drupal.org/node/2817791)):
   <pre><code class="language-php">$settings['skip_permissions_hardening'] = TRUE;</code></pre>
5. One of my pet peeves is having any warnings or errors in the _Status Report_ even though it's just a local development environment and usually after this initial setup, you may get warnings with regards to trusted host settings and that the _sites/default/config_ folder is not writable.
I resolved them by adding these lines to the `settings.local.php` file, but your mileage may vary depending on what your local development setup is like.
<pre><code class="language-php">$config_directories['sync'] = 'sites/default/config';
$settings['trusted_host_patterns'] = array(
  '^sinvict\.dev$',
);</code></pre>

## Committing changes to the repository

Unfortunately, in order to have multiple development branches, you'll have to pay for a proper business account. I don't really want to pay at this point, so I'm going to commit the sin of committing straight on the master branch. Circumstances, my friends.

My method involves drush, because I am an avid command-line lover. First off, download the drush aliases from your dashboard and place the file (_pantheon.aliases.drushrc.php_) in your _.drush_ folder or the _aliases_ folder of your local drush installation.

To check that things are working run the following:

<pre><code class="language-bash">drush sa</code></pre>

You should see something like this:

<pre><code class="language-bash">@none
@pantheon
@pantheon.sinvict.dev
@pantheon.sinvict.live
@pantheon.sinvict.test
@self
default</code></pre>

With this, you can run drush commands on your Pantheon development server from the terminal on your local machine. Say you installed and enabled a module, and would like to deploy this change upstairs. Commit the module and push it up to Pantheon as you would any other server.

Then, run the following drush command to enable it upstairs:

<pre><code class="language-bash">drush @pantheon.sinvict.dev en MODULENAME -y</code></pre>

## Quirky things

This is probably just me, but on Firefox with uBlock Origin enabled, the dashboard couldn't load for me. If that happens to be your situation, maybe try disabling uBlock Origin?

If I find any more quirky behaviour, this section will be updated, but I sincerely hope not.

## Wrapping up

That's pretty much it. If you didn't see through me, this is actually my personal documentation for setting up to develop sites on Pantheon, so I'm sorry if you don't find it useful. No hard feelings? <span class="emoji" role="img" tabindex="0" aria-label="face blowing a kiss">&#x1F618;</span>
