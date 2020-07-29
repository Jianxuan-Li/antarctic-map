#!/bin/bash
coverage run --source='.' manage.py test --keepdb geodata
coverage report