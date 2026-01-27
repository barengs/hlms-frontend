import { Settings, Plus, Trash2 } from 'lucide-react';
import { Button, Dropdown } from '@/components/ui';

interface SettingsDropdownProps {
    onAddCourse: () => void;
    currentCourse: { id: string; title: string } | null;
    onRemoveCourse: () => void;
    language: string;
}

export function SettingsDropdown({ onAddCourse, currentCourse, onRemoveCourse, language }: SettingsDropdownProps) {
    const items = [
        ...(currentCourse ? [{
            label: language === 'id' ? 'Hapus Kursus' : 'Remove Course',
            icon: <Trash2 className="w-4 h-4" />,
            onClick: onRemoveCourse,
            danger: true
        }] : [{
            label: language === 'id' ? 'Tambahkan Kursus' : 'Add Course',
            icon: <Plus className="w-4 h-4" />,
            onClick: onAddCourse,
        }])
    ];

    return (
        <Dropdown
            trigger={
                <Button leftIcon={<Settings className="w-4 h-4" />}>
                    {language === 'id' ? 'Pengaturan' : 'Settings'}
                </Button>
            }
            items={items}
            align="right"
        />
    );
}
