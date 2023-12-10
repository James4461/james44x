<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'james44x' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '=DM-}W#u{sdl;(Ch)I26|uF<~1;qLoN)x,yyfgoYw,FeTv(,!<]oVubtoR}Cs|OL' );
define( 'SECURE_AUTH_KEY',  'Bs|6<?KZ1 Y2N EqTNJrWO8!JLwHk68!%Yas-z[7xioutnX[YlkC>6[oDAaN:!q&' );
define( 'LOGGED_IN_KEY',    'Vq@5$kFH kOK]d<PSHI_9qO!gW|wn-yMl-+%PA&jU^ZJ`@AqwJNSQmu .|;C&PXj' );
define( 'NONCE_KEY',        't8.5nZRfkwO,C0jJ G]0:@->3jv#GOFs?t{VIZ7}y/Z-~qOihLKHfV+MfR/a|;2l' );
define( 'AUTH_SALT',        'W/#Xv6(;>V^qXSXL+3[Iw2Jv)*)P{9L*qR%Cj=5 %.!/FoI%Deka8g_aq]#LwF=&' );
define( 'SECURE_AUTH_SALT', 'O`FC$^?W# C7>lVvg%O[m0EMXXo4xh-Rtfm*UwjSHmnhb$S)CeS-0foq~xn(J [ ' );
define( 'LOGGED_IN_SALT',   'yb/&$g3;i#Na^K0QYBw:F-3+7>4isR:^|3kyo]E5[C]u]r!ZG<^7A6@:b3cAGUh.' );
define( 'NONCE_SALT',       'ifpWM3@IB:~EVMi.P=SO9mr|&3GIQ%|=C)[twS8@[G%BT4w300u&<?o/#TQC=NY/' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */
define('FS_METHOD','direct');
define('WP_MEMORY_LIMIT', '256');
@ini_set( 'upload_max_filesize' , '512M' );
@ini_set( 'post_max_size', '128M');
@ini_set( 'max_execution_time', '300' );
@ini_set( 'max_input_time', '300' );


/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
