# -*- mode: python ; coding: utf-8 -*-
import os
import sys

local_lib = '/usr/local/lib/python3.8/dist-packages'

block_cipher = None

added_files = [
  (os.path.join(local_lib, 'webpack_loader'), 'webpack_loader'),
  (os.path.join(local_lib, 'rest_framework'), 'rest_framework'),
  (os.path.join(local_lib, 'uvicorn'), 'uvicorn'),
  (os.path.join(local_lib, 'rasterio'), 'rasterio'),
  (os.path.join(local_lib, 'certifi'), 'certifi'),
  (os.path.join(local_lib, 'h11'), 'h11'),
  ('geodata', 'geodata'),
  ('map', 'map'),
  ('portal', 'portal'),
]

hide_imports = [
  "rest_framework",
  "webpack_loader",
  "uvicorn",
  "rasterio",
  "certifi",
  "h11",
  "GDAL",

  "map",
  "geodata",
  "portal",
]

manage_a = Analysis(['manage.py'],
             pathex=['/antarctic'],
             binaries=[],
             datas=added_files,
             hiddenimports=hide_imports,
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)

app_a = Analysis(['app.py'],
             pathex=['/antarctic'],
             binaries=[],
             datas=added_files,
             hiddenimports=hide_imports,
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)

report_a = Analysis(['report.py'],
             pathex=['/antarctic'],
             binaries=[],
             datas=added_files,
             hiddenimports=hide_imports,
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)

MERGE((manage_a, 'manage', 'manage'), (app_a, 'app', 'app'))


manage_pyz = PYZ(manage_a.pure, manage_a.zipped_data,
             cipher=block_cipher)
manage_exe = EXE(manage_pyz,
          manage_a.scripts,
          [],
          exclude_binaries=True,
          name='manage',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=True )

manage_coll = COLLECT(manage_exe,
               manage_a.binaries,
               manage_a.zipfiles,
               manage_a.datas,
               strip=False,
               upx=True,
               upx_exclude=[],
               name=os.path.join('dist', 'manage'))

app_pyz = PYZ(app_a.pure, app_a.zipped_data,
             cipher=block_cipher)
app_exe = EXE(app_pyz,
          app_a.scripts,
          [],
          exclude_binaries=True,
          name='app',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=True )

app_coll = COLLECT(app_exe,
               app_a.binaries,
               app_a.zipfiles,
               app_a.datas,
               strip=False,
               upx=True,
               upx_exclude=[],
               name=os.path.join('dist', 'app'))
