import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
    const areaName = url.searchParams.get('areaName');
    type AreaName = 'Gulshan' | 'Banani';


    if (!areaName) error(400, 'areaName query parameter is required');
    if (areaName !== 'Gulshan' && areaName !== 'Banani') error(400, 'Invalid areaName');

    const areaData:Record<AreaName, { nIncidents: number; indicator: { level: string; color: string } }> = {
        "Gulshan": {
            'nIncidents': 5,
            'indicator':{'level': 'high', 'color': 'red'}
        },
        "Banani": {
            'nIncidents': 2,
            'indicator':{'level': 'medium', 'color': 'yellow'}
        }

    }

    return new Response(JSON.stringify(areaData[areaName] || {}));
};


export const POST: RequestHandler = async ({ request }) => {
    const formData = await request.formData();
    
    const min = Number(formData.get('min') ?? '0');
    const max = Number(formData.get('max') ?? '1');
    
    const d = max - min;

    if (isNaN(d) || d < 0) 
        error(400, 'min and max must be numbers, and min must be less than max');
    
    const random = min + Math.random() * d;

    return new Response(String(random));
};