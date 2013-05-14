#
# Cookbook Name:: win-apps
# Recipe:: default
#
# Copyright 2013, pekepeke
#
# All rights reserved - Do Not Redistribute
#

include_recipe 'windows'

ZIP_APPLICATION_ROOT = File.expand_path("../Apps", ENV['USERPROFILE'])

Applications = {
  'Vim' => {
    source: "http://files.kaoriya.net/goto/vim73w32",
    source_x86_64: "http://files.kaoriya.net/goto/vim73w64",
    provider: 'zip',
  },
  "Explzh" =>{
    source: "http://www.ponsoftware.com/archiver/explzh/explz711.exe",
    source_x86_64: "http://www.ponsoftware.com/archiver/explzh/explz711_x64.exe",
    provider: "package",
  },
  # 'Putty' => {
  #   source: "http://the.earth.li/~sgtatham/putty/latest/x86/putty-0.60-installer.exe",
  #   installer_type: :inno,
  #   provider: 'package',
  # },
  # '7-zip' => {
  #   source: "http://downloads.sourceforge.net/sevenzip/7z920-x64.msi",
  #   provider: 'package',
  # },
  # "Notepad++" => {
  #   source: "c:/installation_files/npp.5.9.2.Installer.exe",
  #   provider: 'package',
  # },
  "Google Chrome" => {
    source: "https://dl-ssl.google.com/tag/s/appguid%3D%7B8A69D345-D564-463C-AFF1-A69D9E530F96%7D%26iid%3D%7B806F36C0-CB54-4A84-A3F3-0CF8A86575E0%7D%26lang%3Den%26browser%3D3%26usagestats%3D0%26appname%3DGoogle%2520Chrome%26needsadmin%3Dfalse/edgedl/chrome/install/GoogleChromeStandaloneEnterprise.msi",
    provider: 'package',
  },
  # 'VLC' => {
  #   source: "http://superb-sea2.dl.sourceforge.net/project/vlc/1.1.10/win32/vlc-1.1.10-win32.exe",
  #   provider: 'package',
  # },
}.map{|name, attr| OpenStruct.new(attr.merge({ :app_name => name })) }

Applications.each do |app|
  if x86_64?
    app.source = app.source_64bit if app.respond_to? :source_64bit
  end

  if zip_app? app
    app.path = File.join(ZIP_APPLICATION_ROOT, app.app_name)
    app.action = :unzip
    app.not_if = proc{File.exists? app.path}

    windows_zipfile app.app_name do
      %w[source path action not_if].each do |attr|
        send(attr, app.send(attr)) if app.respond_to? attr
      end
    end
  elsif win_package? app
    app.action = :install
    windows_package app.app_name do
      %w[source installer_type action].each do |attr|
        send(attr, app.send(attr)) if app.respond_to? attr
      end
    end
  end
end

windows_zipfile "#{ZIP_APPLICATION_ROOT}\\Vim" do
  source 'http://files.kaoriya.net/var/vim-online-update-20130122.zip'
  path   File.join(ZIP_APPLICATION_ROOT, 'Vim')
  action :unzip
  not_if { File.exists? "#{ZIP_APPLICATION_ROOT}\\Vim\\vim-online-update" }
end

# windows_batch "" do
#   code <<-EOS
#   EOS
#   .encode('Windows-31J', 'utf-8')
# end
