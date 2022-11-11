# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))


# -- Project information -----------------------------------------------------

project = 'NUM CODEX'
copyright = '2022, Netzwerk Universitätsmedizin'
author = 'Netzwerk Universitätsmedizin'

# The full version, including alpha/beta/rc tags
release = '1.x'

version = '1.9.0'

# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
  'myst_parser',
  'hoverxref.extension',
  'sphinxemoji.sphinxemoji'
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# The language for content autogenerated by Sphinx. Refer to documentation
# for a list of supported languages.
#
# This is also used if you do content translation via gettext catalogs.
# Usually you set "language" from the command line for these cases.
language = 'en'

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'sphinx_material'

# Material theme options (see theme.conf for more information)
html_theme_options = {

    # Specify a base_url used to generate sitemap.xml. If not
    # specified, then no sitemap will be built.
    "base_url": "https://wise-portal.readthedocs.io/de/latest/",

    # Set the color and the accent color
    "color_primary": "indigo",
    "color_accent": "deep-orange",
    "theme_color": "5f0d22",

    # Set the repo location to get a badge with stats
    "repo_url": "https://github.com/xWiseWolfx/num-portal-webapp",
    "repo_name": "NUM Portal Webapp",

    # Visible levels of the global TOC; -1 means unlimited
    "globaltoc_depth": 2,
    # If False, expand all TOC entries
    "globaltoc_collapse": True,
    # If True, show hidden TOC entries
    "globaltoc_includehidden": False,

    # Show version dropdown
    "version_dropdown": False,

    # Minify output
    "html_minify": False,
    "css_minify": False,
}

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

# Translation settings
# File where translated locales are located
locale_dirs = ['locales']
# Use uuid values for message catalogues
gettext_uuid = True
# Use compact
gettext_compact = False

# HTML sidebar config
html_sidebars = {
  "**": ["logo-text.html", "globaltoc.html", "localtoc.html", "searchbox.html"],
}

# hoverxref settings for tooltips and modals used for glossary and other references.
# Use the tooltip or modal of hoverxref for all reference roles inside this list
hoverxref_roles = ['term']

# Emoji style
sphinxemoji_style = 'twemoji'

# Allowing Sphinx to use fuzzy translations and don't fall back to the standard language (as is default for Sphinx)
gettext_allow_fuzzy_translations = True
