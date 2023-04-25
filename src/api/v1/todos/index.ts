import { prefixRoutes } from '../../utils';

import create from './routes/create';
import delete_ from './routes/delete';
import get from './routes/get';
import list from './routes/list';
import update from './routes/update';

export default prefixRoutes('/todos', [create, delete_, get, list, update]);
