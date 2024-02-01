## ignore terraform dir. that holds cached files
## issue with git ignore and possible solution from web: git filter-branch -f --index-filter 'git rm --cached -r --ignore-unmatch .terraform/'

## removing every `.terraform` dir from sub-directories
## Step: Start finding from current dir. (root) and delete all sub dir. `.terraform`
find . -type d -name '.terraform' -exec rm -r {} +