#!/bin/bash
coverage run --source='.' manage.py test geodata
coverage report