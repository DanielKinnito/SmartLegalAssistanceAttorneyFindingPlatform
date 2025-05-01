from setuptools import setup, find_packages

setup(
    name="shared",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "pyjwt>=2.6.0,<3.0.0",
    ],
    description="Shared utilities for the Smart Legal Assistance Platform",
    author="Smart Legal Assistance Team",
) 