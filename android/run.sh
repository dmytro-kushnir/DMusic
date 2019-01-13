#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n com.reaptorrr697.DMusic/host.exp.exponent.MainActivity
