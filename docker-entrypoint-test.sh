#!/bin/bash
pipenv install
pipenv run coverage run --source='.' --omit=.venv/* manage.py test --no-input geodata
pipenv run coverage report
rm -rf .venv
rm -rf .coverage