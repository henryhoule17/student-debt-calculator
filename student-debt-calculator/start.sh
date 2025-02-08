#!/bin/bash

# Start the FastAPI backend
cd backend

# Check if conda environment exists, create if it doesn't
if ! conda env list | grep -q student-debt-calc; then
    echo "Creating conda environment..."
    conda env create -f environment.yml
fi

# Activate conda environment
eval "$(conda shell.bash hook)"
conda activate student-debt-calc

# Start the FastAPI backend
cd app
uvicorn main:app --reload &

# Start the React frontend
cd ../../
npm run dev
