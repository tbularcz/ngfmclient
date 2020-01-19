cd 'C:\Users\bularct\github\ngfmclient'
npm run build
Copy-Item -Path "C:\Users\bularct\github\ngfmclient\build" -Destination "\\192.168.2.137\SambaWeb\ngfm\" -recurse -force
