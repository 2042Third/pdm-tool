ng build --localize --base-href ./www/ & ^
echo Y | rmdir /s ..\web_notes\www & ^
xcopy /E /Y www ..\web_notes\www & ^
cd ..\web_notes &^
pack.cmd &^
cd ..\pdm-notes
