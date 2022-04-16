ng build --base-href ./dist/pdm-notes/ & ^
xcopy /E /Y dist ..\web_notes\dist & ^
cd ..\web_notes &^
pack.cmd &^
cd ..\pdm-notes
