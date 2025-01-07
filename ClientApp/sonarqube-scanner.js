const scanner = require('sonarqube-scanner');

scanner(
    {
        serverUrl: "https://sonarcloud.io",
        options: {
            "sonar.sourceEncoding": "UTF-8",
            "sonar.projectKey": "sportaforked_ClientApp",
            "sonar.organization": "sportaforked",
            "sonar.sources": "./src",
            "sonar.tests": "__tests__",
            "sonar.testExecutionReportPaths": "test-report.xml",
            "sonar.javascript.lcov.reportPaths": "coverage/clover.info",
        },
    },
    () => process.exit();
);