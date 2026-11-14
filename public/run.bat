@echo off
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
if not exist "%JAVA_HOME%\bin\java.exe" (
  echo JAVA_HOME not found at %JAVA_HOME%
  echo Install JDK 21 or edit this script.
  exit /b 1
)
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0"
mvnw.cmd spring-boot:run
