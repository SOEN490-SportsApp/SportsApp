<#macro emailLayout>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0;">
    <div style="width: 100%; background-color: #4CAF50; text-align: center; padding: 20px 0;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Welcome to Sporta</h1>
        <p style="margin: 5px 0 0; color: #dff0d8; font-size: 18px;">Your go-to app for sports events and
            tournaments</p>
    </div>
    <div style="padding: 20px; background: #ffffff; min-height: 400px;">
        <#nested>
    </div>
    <footer style="width: 100%; background-color: #4CAF50; color: #ffffff; text-align: center; padding: 15px 0; font-size: 14px;">
        <p>You're receiving this email because you're a valued Sporta user.</p>
        <p>Need help? Contact us: <a href="mailto:support@sporta.com"
                                     style="color: #ffffff; text-decoration: underline;">support@sporta.com</a></p>
        <p style="margin-top: 10px;">Follow us:
            <a href="https://twitter.com/sporta" style="color: #ffffff; text-decoration: underline;">Twitter</a> |
            <a href="https://instagram.com/sporta" style="color: #ffffff; text-decoration: underline;">Instagram</a>
        </p>
    </footer>
    </body>
    </html>
</#macro>