@echo OFF

if not exist vendor (
	echo *** exec bundle install
	bundle install --path vendor\bundle
	echo *** install chef cookbooks
	bundle exec librarian-chef install
)
echo *** apply chef recipes
bundle exec chef-solo -c config/solo.rb

goto :EOF
