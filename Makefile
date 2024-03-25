.PHONY: all

all:
	glib-compile-schemas schemas
	gnome-extensions pack --force

install:
	gnome-extensions install --force panelcommand@jieran233.github.io.shell-extension.zip
	# Please logout to apply extension installation!