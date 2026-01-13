"use client";

import { useState, useMemo } from 'react';
import Button from '../Button/Button';
import styles from './PricingCalculator.module.css';

const STATES = {
    group200: ["Alaska", "Florida", "Nevada", "New Hampshire", "South Dakota", "Tennessee", "Texas", "Washington", "Wyoming"],
    group300: ["Arizona", "Colorada", "Idaho", "Indiana", "Kansas", "Kentucky", "Maine", "Michigan", "Minnesota", "Mississippi", "Missouri", "Nebraska", "New Mexico", "North Dakota", "Oklahoma", "South Carolina", "Utah", "Wisconsin"],
    group400: ["Alabama", "Arkansas", "Georgia", "Iowa", "Louisiana", "Montana", "Rhode Island", "Vermont", "West Virginia"],
    group500: ["Connecticut", "District of Columbia", "Illinois", "Massachusetts", "New Jersey", "New York", "Ohio", "Virginia"],
    unavailable: ["California", "Maryland", "Oregon", "Pennsylvania"]
};

const FILING_STATUS_COST = {
    "Single": 0,
    "Married Filing Jointly": 30,
    "Married Filing Separately": 0,
    "Head of Household": 0,
    "Qualifying Widow(er)": 30
};

const SITUATIONS = [
    { id: "w2", label: "W-2 employment", price: 0 },
    { id: "interest", label: "Interest income", price: 30 },
    { id: "retirement", label: "Retirement income", price: 30 },
    { id: "education", label: "Education credit", price: 30 },
    { id: "self_emp", label: "Self-employment / contractor income (1099-NEC)", price: 50 },
    { id: "rental", label: "Rental property income", price: 50 },
    { id: "investment", label: "Investment income", price: 50 },
    { id: "crypto", label: "Crypto transactions", price: 50 },
    { id: "itemized", label: "Itemized deduction", price: 50 },
    { id: "depreciation", label: "Depreciation of vehicles/equipment", price: 50 },
    { id: "foreign", label: "Foreign source of income", price: 100 }
];

const TX_VOL_COST = {
    "0-300": 250,
    "301-600": 300,
    "601-1000": 500,
    "1001-2000": 1000,
    "2000+": 1500
};

const ACCT_COUNT_COST = {
    "0-5": 0,
    "5-10": 50,
    "10+": 150
};

const ASSET_COST = {
    "0": 0,
    "1-5": 50,
    "6-10": 100,
    "10+": 200
};

export default function PricingCalculator({ dict, lang }) {
    const [activeTab, setActiveTab] = useState('tax'); // 'tax' or 'bookkeeping'

    // Tax State
    const [location, setLocation] = useState('');
    const [filingStatus, setFilingStatus] = useState('Single');
    const [hasDependents, setHasDependents] = useState(false);
    const [situations, setSituations] = useState([]);

    // Bookkeeping State
    const [txVolume, setTxVolume] = useState('0-300');
    const [accountCount, setAccountCount] = useState('0-5');
    const [accountingMethod, setAccountingMethod] = useState('Cash');
    const [hasMerchant, setHasMerchant] = useState(false);
    const [hasLoans, setHasLoans] = useState(false);
    const [assetCount, setAssetCount] = useState('0');

    const handleSituationToggle = (id) => {
        setSituations(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const taxEstimate = useMemo(() => {
        if (!location) return 0;
        if (location === 'Non-USA') return -1; // Custom
        if (STATES.unavailable.includes(location)) return -2; // Unavailable

        let base = 0;
        if (STATES.group200.includes(location)) base = 200;
        else if (STATES.group300.includes(location)) base = 300;
        else if (STATES.group400.includes(location)) base = 400;
        else if (STATES.group500.includes(location)) base = 500;
        else return -1; // Unknown state, maybe custom

        const statusCost = FILING_STATUS_COST[filingStatus] || 0;
        const depCost = hasDependents ? 30 : 0;
        const situationCost = situations.reduce((acc, id) => {
            const item = SITUATIONS.find(s => s.id === id);
            return acc + (item ? item.price : 0);
        }, 0);

        return base + statusCost + depCost + situationCost;
    }, [location, filingStatus, hasDependents, situations]);

    const bookkeepingEstimate = useMemo(() => {
        const base = TX_VOL_COST[txVolume] || 250;
        const acct = ACCT_COUNT_COST[accountCount] || 0;
        const multiplier = accountingMethod === 'Accrual' ? 2 : 1;

        let subtotal = (base + acct) * multiplier;

        if (hasMerchant) subtotal += 100;
        if (hasLoans) subtotal += 50;
        subtotal += (ASSET_COST[assetCount] || 0);

        return subtotal;
    }, [txVolume, accountCount, accountingMethod, hasMerchant, hasLoans, assetCount]);

    // Create a flat list of all states for the dropdown
    const allStates = [
        ...STATES.group200, ...STATES.group300, ...STATES.group400, ...STATES.group500, ...STATES.unavailable
    ].sort();

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'tax' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('tax')}
                >
                    Tax Preparation
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'bookkeeping' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('bookkeeping')}
                >
                    Bookkeeping
                </button>
            </div>

            {activeTab === 'tax' && (
                <div className={styles.content}>
                    <div className={styles.step}>
                        <h3 className={styles.stepTitle}>Step 1: Location</h3>
                        <div className={styles.group}>
                            <label className={styles.label}>Where do you live?</label>
                            <select
                                className={styles.select}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            >
                                <option value="">Select your state...</option>
                                <option value="Non-USA">I do NOT reside in the USA</option>
                                {allStates.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className={styles.step}>
                        <h3 className={styles.stepTitle}>Step 2: The Basics</h3>
                        <div className={styles.group}>
                            <label className={styles.label}>Filing Status</label>
                            <select
                                className={styles.select}
                                value={filingStatus}
                                onChange={(e) => setFilingStatus(e.target.value)}
                            >
                                {Object.keys(FILING_STATUS_COST).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={hasDependents}
                                    onChange={(e) => setHasDependents(e.target.checked)}
                                />
                                Do you have dependents?
                            </label>
                        </div>
                    </div>

                    <div className={styles.step}>
                        <h3 className={styles.stepTitle}>Step 3: Income & Situations</h3>
                        <div className={styles.checkboxGroup}>
                            {SITUATIONS.map(s => (
                                <label key={s.id} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={situations.includes(s.id)}
                                        onChange={() => handleSituationToggle(s.id)}
                                    />
                                    {s.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.result}>
                        {location === 'Non-USA' ? (
                            <div className={styles.contactMsg}>
                                <h4 className={styles.estimateLabel}>International Custom Quote</h4>
                                <p>Because you are currently outside the USA, your pricing requires a more detailed review. Please reach out for a custom estimate.</p>
                                <Button href={`/${lang}/contact`} variant="primary" className="mt-4">Contact Us</Button>
                            </div>
                        ) : location && STATES.unavailable.includes(location) ? (
                            <div className={styles.error}>
                                <h4>State Unavailable</h4>
                                <p>We currently do not provide services in {location}.</p>
                            </div>
                        ) : location ? (
                            <>
                                <h4 className={styles.estimateLabel}>Your Tax Prep Estimate</h4>
                                <div className={styles.price}>${taxEstimate}</div>
                                <div className={styles.deposit}>
                                    Required Deposit: $200 (credited towards final fee)
                                </div>
                                <div className={styles.disclaimer}>
                                    The amount above represents an approximate estimate only; final fees will be determined once we complete a comprehensive review.
                                </div>
                                <Button href={`/${lang}/book`} variant="primary">Book Now</Button>
                            </>
                        ) : (
                            <p className="text-slate-500">Please select your location to see an estimate.</p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'bookkeeping' && (
                <div className={styles.content}>
                    <div className={styles.step}>
                        <h3 className={styles.stepTitle}>Bookkeeping Details</h3>
                        <div className={styles.group}>
                            <label className={styles.label}>Monthly Transactions</label>
                            <select className={styles.select} value={txVolume} onChange={(e) => setTxVolume(e.target.value)}>
                                <option value="0-300">Up to 300</option>
                                <option value="301-600">301 - 600</option>
                                <option value="601-1000">601 - 1000</option>
                                <option value="1001-2000">1001 - 2000</option>
                                <option value="2000+">Over 2000</option>
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Number of Accounts</label>
                            <select className={styles.select} value={accountCount} onChange={(e) => setAccountCount(e.target.value)}>
                                <option value="0-5">Up to 5</option>
                                <option value="5-10">5 - 10</option>
                                <option value="10+">Over 10</option>
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Accounting Method</label>
                            <select className={styles.select} value={accountingMethod} onChange={(e) => setAccountingMethod(e.target.value)}>
                                <option value="Cash">Cash Basis</option>
                                <option value="Accrual">Accrual Basis</option>
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Depreciable Assets</label>
                            <select className={styles.select} value={assetCount} onChange={(e) => setAssetCount(e.target.value)}>
                                <option value="0">0</option>
                                <option value="1-5">1 - 5</option>
                                <option value="6-10">6 - 10</option>
                                <option value="10+">Over 10</option>
                            </select>
                        </div>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={hasMerchant}
                                    onChange={(e) => setHasMerchant(e.target.checked)}
                                />
                                Do you have merchant processors? (Stripe, Square, etc)
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={hasLoans}
                                    onChange={(e) => setHasLoans(e.target.checked)}
                                />
                                Any loans, leases, or financing to track?
                            </label>
                        </div>
                    </div>

                    <div className={styles.result}>
                        <h4 className={styles.estimateLabel}>Monthly Bookkeeping Estimate</h4>
                        <div className={styles.price}>${bookkeepingEstimate}<span style={{ fontSize: '1rem', color: '#666' }}>/mo</span></div>
                        <div className={styles.deposit}>
                            Required Deposit: $200 (credited towards first month)
                        </div>
                        <div className={styles.disclaimer}>
                            The amount above represents an approximate estimate only; final fees will be determined once we complete a comprehensive review.
                        </div>
                        <Button href={`/${lang}/book`} variant="primary">Book Consultation</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
