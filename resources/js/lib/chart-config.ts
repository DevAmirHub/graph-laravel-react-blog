import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';

ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

export const chartColors = {
    draft: 'rgb(148, 163, 184)',
    published: 'rgb(34, 197, 94)',
    archived: 'rgb(245, 158, 11)',
    pending: 'rgb(148, 163, 184)',
    approved: 'rgb(34, 197, 94)',
    rejected: 'rgb(239, 68, 68)',
    primary: 'rgb(59, 130, 246)',
    secondary: 'rgb(139, 92, 246)',
    accent: 'rgb(245, 158, 11)',
};

export const chartPalette = [
    'rgb(59, 130, 246)',
    'rgb(34, 197, 94)',
    'rgb(245, 158, 11)',
    'rgb(239, 68, 68)',
    'rgb(139, 92, 246)',
    'rgb(236, 72, 153)',
    'rgb(20, 184, 166)',
    'rgb(249, 115, 22)',
    'rgb(99, 102, 241)',
    'rgb(132, 204, 22)',
];
