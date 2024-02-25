## ISSUE when pushing terraform code to github
'''
    - ignore terraform dir. that holds cached files
    - possible solution from web: git filter-branch -f --index-filter 'git rm --cached -r --ignore-unmatch .terraform/'

    - alternative approach:
    - removing every `.terraform` dir from sub-directories
    - Steps: Start finding from current dir. (root) and delete all sub dir. `.terraform`

'''
find . -type d -name '.terraform' -exec rm -r {} +


## remove state files
find . -name '*.backup' -delete