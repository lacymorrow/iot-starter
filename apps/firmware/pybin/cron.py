import subprocess
import json

DEBUG = True

def log(text):
    print("[Cron] %s" % text)

def listAll():
    try:
        process = subprocess.check_output(['crontab', '-l'], stderr=subprocess.STDOUT)
        cron_jobs = process.decode("utf-8").strip().split('\n')
        named_jobs = {}
        for line in cron_jobs:
            if line.startswith('# NAME:'):
                name = line.strip('# NAME:').strip()
                named_jobs[name] = ''
            elif line.strip() and not line.startswith('#'):
                last_name = list(named_jobs.keys())[-1] if named_jobs else 'Unnamed'
                named_jobs[last_name] = line.strip()
        response = {"message": named_jobs}
    except subprocess.CalledProcessError as e:
        response = {"error": "Could not list cron jobs", "details": str(e)}

    return response

def add(cron_job, name):
    try:
        process = subprocess.Popen(['crontab', '-l'], stdout=subprocess.PIPE)
        current_crons = process.communicate()[0].decode("utf-8")
        new_crons = current_crons + f"\n# NAME: {name}\n{cron_job}\n"
        subprocess.run(['crontab', '-'], input=new_crons.encode("utf-8"), check=True)
        response = {"message": f"Cron job '{name}' added"}
    except subprocess.CalledProcessError as e:
        response = {"error": "Could not add cron job", "details": str(e)}

    return response

def delete(name):
    try:
        process = subprocess.Popen(['crontab', '-l'], stdout=subprocess.PIPE)
        current_crons = process.communicate()[0].decode("utf-8")
        cron_lines = current_crons.split('\n')
        new_crons = []
        i = 0
        while i < len(cron_lines):
            if cron_lines[i].strip() == f"# NAME: {name}":
                i += 2  # Skip the next line (the actual cron job)
            else:
                new_crons.append(cron_lines[i])
            i += 1
        new_crons = "\n".join(new_crons)
        subprocess.run(['crontab', '-'], input=new_crons.encode("utf-8"), check=True)
        response = {"message": f"Cron job '{name}' deleted"}
    except subprocess.CalledProcessError as e:
        response = {"error": "Could not delete cron job", "details": str(e)}

    return response

def delete_all():
    try:
        # subprocess.run(['crontab', '-r'], check=True)
        subprocess.run("echo '' | crontab -", shell=True, check=True)

        response = {"message": "All cron jobs deleted"}
    except subprocess.CalledProcessError as e:
        response = {"error": "Could not delete all cron jobs", "details": str(e)}

    return response

def update(old_name, new_cron_job, new_name):
    try:
        delete_result = delete(old_name)
        if "error" in delete_result:
            return delete_result
        add_result = add(new_cron_job, new_name)
        response = {"message": f"Cron job '{old_name}' updated to '{new_name}'"}
    except Exception as e:
        response = {"error": "Could not update cron job", "details": str(e)}

    return response