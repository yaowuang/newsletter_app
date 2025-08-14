
import React from 'react';
import { Button } from '@/components/ui/button';

export type FormattingAction = 'bold' | 'italic' | 'ul' | 'ol' | 'link' | 'table' | 'hr';


interface FormattingToolbarProps {
	onAction: (action: FormattingAction) => void;
	disabled?: boolean;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({ onAction, disabled }) => {
	return (
		<div className="flex flex-wrap gap-1 mb-1 text-xs">
			<Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => onAction('bold')} disabled={disabled}><strong>B</strong></Button>
			<Button type="button" size="sm" variant="outline" className="h-7 px-2 italic" onClick={() => onAction('italic')} disabled={disabled}>I</Button>
			<Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => onAction('ul')} disabled={disabled}>&bull; List</Button>
			<Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => onAction('ol')} disabled={disabled}>1. List</Button>
			<Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => onAction('link')} disabled={disabled}>Link</Button>
			<Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => onAction('table')} disabled={disabled}>Table</Button>
			<Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => onAction('hr')} disabled={disabled}>HR</Button>
		</div>
	);
};

export default FormattingToolbar;
