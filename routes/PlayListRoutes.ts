import {Router} from 'express';
import {createPlayList, getAllPlayLists, getPlayList, updatePlayList} from '../controllers/PlayListControllers';

const router: Router = Router();

router.get('/', getAllPlayLists);
router.post('/', createPlayList);
router.get('/:id', getPlayList);
router.put('/:id', updatePlayList);
router.delete('/:id', updatePlayList);

export default router;