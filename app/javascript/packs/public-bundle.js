import ReactOnRails from 'react-on-rails';

import ReferenceSearch from '../bundles/AdvancedSearch/components/ReferenceSearch';
import SelectedReferenceSearch from '../bundles/AdvancedSearch/components/SelectedReferenceSearch';
import ItemTypesReferenceSearch from '../bundles/AdvancedSearch/components/ItemTypesReferenceSearch';
import DateTimeSearch from '../bundles/AdvancedSearch/components/DateTimeSearch';
import DateTimeInput from '../bundles/DateTimeInput/components/DateTimeInput';

import ImageViewer from '../bundles/ImageViewer/components/ImageViewer';
import GeoViewer from '../bundles/GeoViewer/components/GeoViewer';

ReactOnRails.register({
  ReferenceSearch, SelectedReferenceSearch, ItemTypesReferenceSearch,
  DateTimeSearch, DateTimeInput,
  ImageViewer,
  GeoViewer
});
