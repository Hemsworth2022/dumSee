# **Automating DOS to UNIX Line Ending Conversion Using Pre-Commit Hooks**

## **1. Overview**

In many development environments, line ending inconsistencies (DOS `\r\n` vs. UNIX `\n`) can cause issues in version control systems, especially when working in collaborative teams. Traditionally, developers use the `dos2unix` command manually to fix line endings before committing files.

To automate this process, we integrated a Python script into a **Git pre-commit hook** to automatically convert DOS-style line endings to UNIX format before committing files. This eliminates the need for manual intervention and ensures consistency across the repository.

This implementation is applied in the **CTMScripts** repository.

---

## **2. Implementation Details**

### **2.1 Python Script (`fix_dos2unix.py`)**

A Python script was created to scan the repository, identify files with Windows-style line endings (`\r\n`), and convert them to UNIX-style (`\n`).

#### **Python Script**:

```python
#!/usr/bin/env python3
import os

def convert_to_unix(file_path):
    with open(file_path, 'rb') as f:
        content = f.read()
    with open(file_path, 'wb') as f:
        f.write(content.replace(b'\r\n', b'\n'))

def check_and_convert_files():
    for root, _, files in os.walk('.'):
        for file in files:
            if file.endswith('.py') or file.endswith('.sh') or file.endswith('.txt'):
                file_path = os.path.join(root, file)
                convert_to_unix(file_path)
                print(f"Converted: {file_path}")

if __name__ == "__main__":
    check_and_convert_files()
```

### **2.2 Git Pre-Commit Hook**

The script is integrated into Git’s pre-commit hook, ensuring that files are converted **before** they are committed.

#### **Pre-Commit Hook Script (`.git/hooks/pre-commit`)**:

```bash
#!/bin/bash
python3 path/to/fix_dos2unix.py

git add .

if [ $? -ne 0 ]; then
    echo "DOS to UNIX conversion failed. Aborting commit."
    exit 1
fi

echo "DOS to UNIX conversion completed successfully."
exit 0
```

#### **Steps to Set Up the Hook:**

1. Save the pre-commit script to `.git/hooks/pre-commit`.
2. Grant execution permission:
   ```bash
   chmod +x .git/hooks/pre-commit
   ```
3. Test by committing a file:
   ```bash
   git add <filename>
   git commit -m "Test commit"
   ```

---

## **3. Estimated Time Savings**

### **3.1 Manual Process (Before Pre-Commit Hook)**

Without automation, a developer would need to:

1. Commit the code to Bitbucket.
2. Deploy the code to the server.
3. Log into the server.
4. Navigate to the repository.
5. Run the code and encounter an indentation error due to line endings.
6. Run `dos2unix <filename>` manually for each modified file.

**Estimated Time per Commit (Manual Process):**

| Task                                   | Time (seconds) |
| -------------------------------------- | -------------- |
| Commit code to Bitbucket               | 15             |
| Deploy code to server                   | 20             |
| Log into server                         | 20             |
| Navigate to repository                  | 10             |
| Run code and encounter indent error     | 10             |
| Run `dos2unix` manually on each file    | 15             |
| Total Time Spent per Commit             | **90 sec**     |

### **3.2 Automated Process (With Pre-Commit Hook)**

With the pre-commit hook:

1. The script automatically detects and converts line endings.
2. Modified files are staged automatically.
3. The commit proceeds without manual intervention.

**Estimated Time per Commit (Automated Process):**

| Task                             | Time (seconds) |
| -------------------------------- | -------------- |
| Run Python script (automatic)    | 3              |
| Stage modified files (automatic) | 2              |
| Total Time Spent per Commit      | **5 sec**      |

### **3.3 Time Saved Across Environments**

| Environment | Manual (sec) | Automated (sec) | Time Saved (sec) |
|------------|--------------|----------------|------------------|
| DIT        | 90           | 5              | 85               |
| SIT        | 90           | 5              | 85               |
| UAT        | 90           | 5              | 85               |
| LTA        | 90           | 5              | 85               |
| PROD       | 90           | 5              | 85               |

Assuming an **average of 10 commits per developer per day**, the total time saved is:

- **85 sec x 10 commits = 850 sec (14.2 minutes per developer per day)**
- **For a team of 5 developers: 14.2 min x 5 = ~71 min saved per day**
- **Per month (~22 working days): 71 min x 22 = ~26 hours saved per month**

---

## **4. Conclusion**

Integrating `dos2unix` as a **pre-commit hook** drastically reduces manual effort, enforces consistency, and improves development efficiency. By automating this process, developers save approximately **26+ hours per month** across a small team, allowing them to focus on more critical tasks.

This solution ensures that no improperly formatted files make it into the repository, reducing potential build or execution errors caused by inconsistent line endings.

---

### **5. Future Improvements**

- Extend support for additional file types (e.g., `.js`, `.css`, `.md`).
- Add logging to track converted files.
- Integrate `dos2unix` within Jenkins CI/CD pipelines for automated validation.

**End of Document**

