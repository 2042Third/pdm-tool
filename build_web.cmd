ng build --localize --base-href ./dist/pdm-notes/ & ^
echo Y | rmdir /s ..\web_notes\dist\pdm-notes & ^
xcopy /E /Y dist ..\web_notes\dist & ^
cd ..\web_notes &^
pack.cmd &^
cd ..\pdm-notes
