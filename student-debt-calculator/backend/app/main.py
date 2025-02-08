from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the most recent institution and program data
df = pd.read_csv('../College_Scorecard_Raw_Data_01162025/Most-Recent-Cohorts-Institution.csv')
program_df = pd.read_csv('../College_Scorecard_Raw_Data_01162025/Most-Recent-Cohorts-Field-of-Study.csv')

# CIP Code to Major Name mapping
CIP_CODES = {
    '01': 'Agriculture',
    '03': 'Natural Resources',
    '04': 'Architecture',
    '05': 'Area Studies',
    '09': 'Communication',
    '10': 'Communications Technology',
    '11': 'Computer Science',
    '12': 'Culinary Services',
    '13': 'Education',
    '14': 'Engineering',
    '15': 'Engineering Technology',
    '16': 'Foreign Languages',
    '19': 'Family Sciences',
    '22': 'Legal Studies',
    '23': 'English',
    '24': 'Liberal Arts',
    '25': 'Library Science',
    '26': 'Biological Sciences',
    '27': 'Mathematics',
    '29': 'Military Technologies',
    '30': 'Interdisciplinary Studies',
    '31': 'Parks and Recreation',
    '38': 'Philosophy',
    '39': 'Theology',
    '40': 'Physical Sciences',
    '41': 'Science Technologies',
    '42': 'Psychology',
    '43': 'Security Studies',
    '44': 'Public Administration',
    '45': 'Social Sciences',
    '46': 'Construction Trades',
    '47': 'Mechanic Technologies',
    '48': 'Precision Production',
    '49': 'Transportation',
    '50': 'Visual and Performing Arts',
    '51': 'Health Professions',
    '52': 'Business',
    '54': 'History',
}

def get_major_name(cipcode):
    if not cipcode or pd.isna(cipcode):
        return 'Unknown Major'
    # Get the first two digits of the CIP code
    major_code = str(cipcode).split('.')[0].zfill(2)
    return CIP_CODES.get(major_code, f'Major {major_code}')

class School(BaseModel):
    name: str
    tuition: float
    admission_rate: Optional[float] = None
    graduation_rate: Optional[float] = None
    median_earnings: Optional[float] = None

def clean_value(val):
    try:
        if pd.isna(val):
            return None
        # Convert to float first to check for inf
        float_val = float(val)
        if np.isinf(float_val):
            return None
        return float_val
    except (ValueError, TypeError):
        return None

@app.get("/api/schools/search/")
async def search_schools(query: str = Query(..., min_length=2), is_in_state: bool = Query(True)):
    # Filter schools based on the search query
    filtered_df = df[df['INSTNM'].str.contains(query, case=False, na=False)]
    
    # Get the top 10 matches
    schools = filtered_df.head(10).apply(lambda row: {
        'id': row['UNITID'],
        'name': row['INSTNM'],
        'tuition': clean_value(row['TUITIONFEE_IN'] if is_in_state else row['TUITIONFEE_OUT']),
        'admission_rate': clean_value(row['ADM_RATE']),
        'graduation_rate': clean_value(row['C150_4_POOLED']),
        'median_earnings': clean_value(row['MD_EARN_WNE_P10'])
    }, axis=1).tolist()
    
    return schools

@app.get("/api/schools/{school_id}/majors/")
async def get_school_majors(school_id: int):
    # Filter programs for the specific school
    school_programs = program_df[program_df['UNITID'] == school_id]
    
    # Group by major and get the latest data
    # Group programs by major (CIPCODE) and get the highest earning ones
    majors = []
    for _, program in school_programs.iterrows():
        major_data = {
            'code': get_major_name(program['CIPCODE']),
            'name': program['CIPDESC'][:-1],  # Add the detailed description
            'salary': clean_value(program['EARN_MDN_HI_1YR'])  # Median earnings after 1 year
        }
        if major_data['salary'] is not None:  # Only include majors with salary data
            # Check if we already have this major
            existing_major = next((m for m in majors if m['code'] == major_data['code']), None)
            if existing_major is None or major_data['salary'] > existing_major['salary']:
                # Either add new major or update if this version has higher salary
                if existing_major:
                    majors.remove(existing_major)
                majors.append(major_data)
    
    # Sort by salary (highest first)
    majors.sort(key=lambda x: x['salary'] if x['salary'] is not None else 0, reverse=True)
    
    return majors

# @app.get("/api/schools/{school_id}")
# async def get_school_details(school_id: str):
#     school_data = df[df['UNITID'] == int(school_id)].iloc[0]
#     def clean_value(val):
#         if pd.isna(val) or np.isinf(val):
#             return None
#         return float(val) if isinstance(val, (int, float)) else val

#     return {
#         'name': school_data['INSTNM'],
#         'tuition': clean_value(school_data['TUITIONFEE_IN'] if pd.notna(school_data['TUITIONFEE_IN']) else school_data['TUITIONFEE_OUT']),
#         'admission_rate': clean_value(school_data['ADM_RATE']),
#         'graduation_rate': clean_value(school_data['C150_4_POOLED']),
#         'median_earnings': clean_value(school_data['MD_EARN_WNE_P10'])
#     }
