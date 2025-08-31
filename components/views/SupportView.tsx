import React, { useState } from 'react';
import { Card } from '../common/Card';
import { IconExternalLink, IconBlog, IconGitHub } from '../../constants';

const faqs = [
    {
        q: "How do I add a new asset?",
        a: "Navigate to the 'Assets' view from the sidebar. Click the '+ Add New Asset' button on the top right. A form will appear where you can input all the necessary details for your physical asset."
    },
    {
        q: "What does the 'Warning' status on an asset mean?",
        a: "A 'Warning' status indicates that one or more operational parameters are outside the normal range, but the asset is still online. It's a proactive alert to investigate potential issues before they cause a failure. You can use the AI Analysis tool on it."
    },
    {
        q: "How are simulations configured?",
        a: "In the 'Simulations' view, select an asset, then add one or more scenarios with different stress levels. Click 'Run All Simulations' to see a chart of the asset's predicted performance under those conditions."
    },
    {
        q: "Is my data secure?",
        a: "Yes, we use industry-standard encryption for data at rest and in transit. All connections are secured via TLS, and our infrastructure follows best practices for security and compliance."
    }
];

const FaqItem: React.FC<{ q: string, a: string, isOpen: boolean, onClick: () => void }> = ({ q, a, isOpen, onClick }) => (
    <div className="border-b border-border-color">
        <button onClick={onClick} className="w-full flex justify-between items-center p-4 text-left">
            <span className="font-medium text-text-primary">{q}</span>
            <svg className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        {isOpen && <div className="p-4 pt-0 text-text-secondary">{a}</div>}
    </div>
);

export const SupportView: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <Card title="Frequently Asked Questions">
                    <div>
                        {faqs.map((faq, index) => (
                            <FaqItem
                                key={index}
                                q={faq.q}
                                a={faq.a}
                                isOpen={openFaq === index}
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            />
                        ))}
                    </div>
                </Card>
            </div>
            <div className="md:col-span-1">
                <Card title="Contact Support">
                    <div className="space-y-4">
                        <p className="text-text-secondary">If you can't find an answer in the FAQ, our team is here to help.</p>
                        <a href="mailto:info@hereandnowai.com" className="w-full block text-center bg-accent text-brand-secondary font-bold py-2 rounded-lg hover:bg-accent-hover transition-colors">Email Support</a>
                        <button className="w-full bg-secondary border border-border-color text-text-primary font-bold py-2 rounded-lg hover:bg-border-color transition-colors">Schedule a Call</button>
                    </div>
                </Card>
                 <Card title="Resources" className="mt-6">
                    <ul className="space-y-3">
                       <li className="flex items-center text-accent hover:text-accent-hover"><a href="https://hereandnowai.com/blog" target="_blank" rel="noopener noreferrer" className="flex items-center"><IconBlog className="mr-2"/> Our Blog <IconExternalLink className="ml-2"/></a></li>
                       <li className="flex items-center text-accent hover:text-accent-hover"><a href="https://github.com/hereandnowai" target="_blank" rel="noopener noreferrer" className="flex items-center"><IconGitHub className="mr-2"/> GitHub <IconExternalLink className="ml-2"/></a></li>
                       <li className="flex items-center text-accent hover:text-accent-hover"><a href="https://youtube.com/@hereandnow_ai" target="_blank" rel="noopener noreferrer" className="flex items-center">Video Tutorials <IconExternalLink className="ml-2"/></a></li>
                    </ul>
                 </Card>
            </div>
        </div>
    );
};