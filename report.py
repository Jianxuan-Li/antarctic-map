import coverage
from django.core.management import execute_from_command_line

cov = coverage.Coverage()
cov.start()
execute_from_command_line(['manage.py', 'test', '--noinput', 'geodata'])
cov.stop()
cov.save()
cov.report()
