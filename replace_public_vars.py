import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace in activeTab === 'total'
target1 = """          {activeTab === 'total' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full">
            {teamScoringList.map((item, index) => ("""
replacement1 = """          {activeTab === 'total' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full">
            {publicTeamScoringList.map((item, index) => ("""
content = content.replace(target1, replacement1)

# Replace in activeTab === 'category'
target2 = """          {activeTab === 'category' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
              {categoryRankData.map((catData, catIndex) => ("""
replacement2 = """          {activeTab === 'category' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
              {publicCategoryRankData.map((catData, catIndex) => ("""
content = content.replace(target2, replacement2)

# Replace in activeTab === 'top3'
target3 = """          {activeTab === 'top3' && (
            <div className="flex flex-col gap-10 w-full">
              <div>
                <h3 className="text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-5 h-5" /> Top Students By Category
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {topStudentsByCategory.map((catData, catIndex) => ("""
replacement3 = """          {activeTab === 'top3' && (
            <div className="flex flex-col gap-10 w-full">
              <div>
                <h3 className="text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-5 h-5" /> Top Students By Category
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {publicTopStudentsByCategory.map((catData, catIndex) => ("""
content = content.replace(target3, replacement3)

target4 = """              {topStudentsByClass.length > 0 && (
                <div>
                  <h3 className="text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2 mt-4">
                    <Award className="w-5 h-5" /> Top Students By Class
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                    {topStudentsByClass.map((classData, classIndex) => ("""
replacement4 = """              {publicTopStudentsByClass.length > 0 && (
                <div>
                  <h3 className="text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2 mt-4">
                    <Award className="w-5 h-5" /> Top Students By Class
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                    {publicTopStudentsByClass.map((classData, classIndex) => ("""
content = content.replace(target4, replacement4)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
