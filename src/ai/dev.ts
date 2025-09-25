
import { config } from 'dotenv';
config();

import './flows/application-drafter';
import './flows/notice-validator';
import './flows/rag-flow';
import './flows/tts';
import './flows/contextual-faq-suggestion';
import './flows/faculty-notice-validation';
