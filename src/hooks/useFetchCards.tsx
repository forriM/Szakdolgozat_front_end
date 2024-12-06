import { useState, useEffect, useCallback } from 'react';
import { fetchCards } from '../utilities/fetchCards';
import { IdCard } from '../models/IdCard';
import { StudentCard } from '../models/StudentCard';
import { HealthCareCard } from '../models/HelathCareCard';

const useFetchCards = (token: string | undefined) => {
    const [idCards, setIdCards] = useState<IdCard[]>([]);
    const [studentCards, setStudentCards] = useState<StudentCard[]>([]);
    const [healthCareCards, setHealthCareCards] = useState<HealthCareCard[]>([]);
    const [loading, setLoading] = useState(true);

    // Refresh function to refetch the cards
    const refreshData = useCallback(async () => {
        if (!token) return;

        const idCardUrl = 'http://localhost:8000/api/idcard/';
        const studentCardUrl = 'http://localhost:8000/api/studentcard/';
        const healthCareCardUrl = 'http://localhost:8000/api/healthcard/';

        setLoading(true);

        try {
            const [idCardData, studentCardData, healthCareCardData] = await Promise.all([
                fetchCards(idCardUrl, token),
                fetchCards(studentCardUrl, token),
                fetchCards(healthCareCardUrl, token),
            ]);

            setIdCards(idCardData);
            setStudentCards(studentCardData);
            setHealthCareCards(healthCareCardData);
        } catch (error) {
            console.error('Error fetching card data:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    return { idCards, studentCards, healthCareCards, loading, refreshData };
};

export default useFetchCards;
