# 🔐 SSH Connection Guide for AWS EC2

This guide explains how to connect to your EC2 instance via SSH for manual operations or troubleshooting.

## Prerequisites

1. **PEM Key File** - Your EC2 key pair file (e.g., `ttelgo.pem`)
2. **EC2 Instance IP** - Your server's public IP address
3. **SSH Client** - Usually pre-installed on Windows 10/11, macOS, and Linux

---

## Windows (PowerShell/Command Prompt)

### Basic SSH Connection

```powershell
ssh -i "C:\path\to\your\key.pem" ubuntu@3.88.101.239
```

**Using your current setup:**
```powershell
ssh -i "D:\tiktel\ttelgo.pem" ubuntu@3.88.101.239
```

### Step-by-Step

1. **Open PowerShell or Command Prompt**

2. **Navigate to the directory containing your PEM key** (optional):
   ```powershell
   cd D:\tiktel
   ```

3. **Connect using SSH:**
   ```powershell
   ssh -i ttelgo.pem ubuntu@3.88.101.239
   ```

4. **First-time connection** - You'll see a security warning:
   ```
   The authenticity of host '3.88.101.239' can't be established.
   Are you sure you want to continue connecting (yes/no)?
   ```
   Type `yes` and press Enter.

5. **You're now connected!** You should see the Ubuntu prompt:
   ```
   ubuntu@ip-xxx-xxx-xxx-xxx:~$
   ```

---

## Fixing Common Issues

### Issue 1: "Permission denied (publickey)"

**Problem:** PEM key permissions are incorrect.

**Solution (Windows):**
```powershell
# Remove inheritance and set permissions
icacls.exe "D:\tiktel\ttelgo.pem" /inheritance:r
icacls.exe "D:\tiktel\ttelgo.pem" /grant:r "%username%:R"
```

**Solution (Linux/macOS):**
```bash
chmod 400 /path/to/ttelgo.pem
```

### Issue 2: "Connection timed out"

**Possible causes:**
- Security group doesn't allow SSH (port 22) from your IP
- Wrong IP address
- EC2 instance is stopped

**Solutions:**
1. Check EC2 instance status in AWS Console
2. Verify security group allows SSH (port 22) from your IP
3. Confirm the public IP address is correct

### Issue 3: "Host key verification failed"

**Solution:** Remove the old host key:
```powershell
ssh-keygen -R 3.88.101.239
```

---

## Common SSH Commands

Once connected, you can run commands:

### Check Current Directory
```bash
pwd
```

### List Files
```bash
ls -la
```

### Navigate to Project
```bash
cd ~/TTelGoWeb2
```

### Check Nginx Status
```bash
sudo systemctl status nginx
```

### View Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check Disk Space
```bash
df -h
```

### View Running Processes
```bash
ps aux | grep nginx
```

### Exit SSH Session
```bash
exit
```

---

## Using SSH with Your Deployment Script

Your `deploy-fast.ps1` script uses SSH automatically. The script:

1. **Uploads files via SCP:**
   ```powershell
   scp.exe -i $PemKeyPath -o StrictHostKeyChecking=no -C -r "$ProjectPath\dist\*" "${ServerUser}@${ServerIP}:~/TTelGoWeb2/dist-upload/"
   ```

2. **Runs commands via SSH:**
   ```powershell
   ssh.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$ServerUser@$ServerIP" $cmd
   ```

---

## Manual Deployment via SSH

If you want to deploy manually via SSH:

### Step 1: Connect
```powershell
ssh -i "D:\tiktel\ttelgo.pem" ubuntu@3.88.101.239
```

### Step 2: Navigate to Project
```bash
cd ~/TTelGoWeb2
```

### Step 3: Pull Latest Code
```bash
git pull origin main
```

### Step 4: Install Dependencies (if needed)
```bash
npm install
```

### Step 5: Build
```bash
npm run build
```

### Step 6: Deploy to Web Directory
```bash
sudo rm -rf /var/www/ttelgo/*
sudo cp -r dist/* /var/www/ttelgo/
sudo chown -R www-data:www-data /var/www/ttelgo
sudo chmod -R 755 /var/www/ttelgo
```

### Step 7: Reload Nginx
```bash
sudo systemctl reload nginx
```

### Step 8: Exit
```bash
exit
```

---

## Using SSH Config File (Optional)

Create `~/.ssh/config` (or `C:\Users\YourName\.ssh\config` on Windows) for easier connections:

```
Host ttelgo-ec2
    HostName 3.88.101.239
    User ubuntu
    IdentityFile D:\tiktel\ttelgo.pem
    StrictHostKeyChecking no
```

Then connect simply with:
```powershell
ssh ttelgo-ec2
```

---

## Troubleshooting

### Can't Find SSH Command

**Windows:** SSH is built into Windows 10/11. If missing:
- Enable "OpenSSH Client" in Windows Features
- Or use PuTTY as alternative

**macOS/Linux:** Should be pre-installed. If not:
```bash
# macOS
brew install openssh

# Ubuntu/Debian
sudo apt-get install openssh-client
```

### Connection Refused

1. Check EC2 instance is running
2. Verify security group allows port 22
3. Check your IP is whitelisted in security group
4. Try pinging the server: `ping 3.88.101.239`

### Wrong Username

Different AMIs use different default usernames:
- **Ubuntu:** `ubuntu`
- **Amazon Linux:** `ec2-user`
- **Debian:** `admin`
- **CentOS:** `centos`

Check your AMI type in EC2 Console.

---

## Security Best Practices

1. **Never share your PEM key** - Keep it secure
2. **Use key pairs** - Don't use password authentication
3. **Restrict SSH access** - Only allow your IP in security group
4. **Use SSH keys rotation** - Regularly rotate keys
5. **Disable root login** - Use sudo instead

---

## Quick Reference

**Your Current Setup:**
- **PEM Key:** `D:\tiktel\ttelgo.pem`
- **Server IP:** `3.88.101.239`
- **Username:** `ubuntu`

**Quick Connect Command:**
```powershell
ssh -i "D:\tiktel\ttelgo.pem" ubuntu@3.88.101.239
```

---

## Need Help?

If you're still having issues:
1. Check AWS Console → EC2 → Your Instance → Security Groups
2. Verify the instance is running
3. Check the correct username for your AMI
4. Ensure PEM key path is correct
5. Try connecting from a different network (in case of IP restrictions)

