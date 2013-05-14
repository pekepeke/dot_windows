module WinApps
  module Helpers
    def x86_64?()
      kernel['machine'] =~ /x86_64/
    end

    def zip_app?(app)
      app.provider =~ "zip" || app.app_name =~ %r[\.zip$]
    end

    def win_package?(app)
      app.provider =~ "package" || app.app_name =~ %r[\.(msi|exe)$]
    end
  end
end

Chef::Recipe.send(:include, WinApps::Helpers)
