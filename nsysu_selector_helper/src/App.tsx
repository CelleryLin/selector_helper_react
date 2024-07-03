import { FC, useEffect, useState } from 'react';
import { ConfigProvider, Spin } from 'antd';

import type { AcademicYear, Course } from '@/types';
import { useThemeConfig } from '@/hooks/useThemeConfig';
import { NSYSUCourseAPI } from '@/api/NSYSUCourseAPI.ts';
import SectionHeader from '#/SectionHeader.tsx';

const App: FC = () => {
  const [themeConfig, _setThemeConfig] = useThemeConfig();

  const [isLoading, setIsLoading] = useState(true);

  const [selectedKeys, setSelectedKeys] = useState(['all-courses']);
  const [availableSemesters, setAvailableSemesters] = useState<AcademicYear>({
    latest: '',
    history: {},
  });
  const [selectedSemester, setSelectedSemester] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    NSYSUCourseAPI.getAvailableSemesters().then((availableSemesters) => {
      setAvailableSemesters(availableSemesters);
      setSelectedSemester(availableSemesters.latest);
    });
  }, []);

  useEffect(() => {
    if (selectedSemester === '') {
      return;
    }
    setIsLoading(true);
    NSYSUCourseAPI.getSemesterUpdates(selectedSemester)
      .then((updates) => {
        NSYSUCourseAPI.getCourses(selectedSemester, updates.latest).then(
          (courses) => {
            setCourses(courses);
            setTimeout(() => {
              setIsLoading(false);
            }, 250);
          },
        );
      })
      .catch((error) => {
        console.error(error);
        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      });
  }, [selectedSemester]);

  return (
    <ConfigProvider theme={themeConfig}>
      {isLoading && <Spin spinning={true} fullscreen />}
      <SectionHeader
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        availableSemesters={availableSemesters}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
      />
    </ConfigProvider>
  );
};

export default App;
