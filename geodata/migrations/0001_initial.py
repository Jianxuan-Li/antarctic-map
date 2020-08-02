# Generated by Django 3.0.8 on 2020-08-02 09:49

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Seaice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tif_file', models.CharField(max_length=50)),
                ('png_file', models.CharField(max_length=50)),
                ('date', models.DateField()),
                ('ts_created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'sea_ice',
            },
        ),
    ]
