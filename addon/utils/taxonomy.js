import TaxonomyItem from 'quizzes-addon/models/taxonomy/taxonomy-item';
import BrowseItem from 'quizzes-addon/models/taxonomy/browse-item';
import { TAXONOMY_CATEGORIES } from 'quizzes-addon/config/quizzes-config';

/**
 * Generates a taxonomy tree data structure for testing
 * @param {Number} levels - total number of parent/children levels in the tree
 * @param {TaxonomyItem} parent - parent item for all the items created in the current level
 * @param {Number} inc - number by which the number of items in each level will increase
 * @param {Number} currentLevel - current tree level being built (starts at 1)
 * @return {TaxonomyItem[][] ...} - the list of taxonomy items in the first level
 */
export function generateTaxonomyTestTree(
  levels = 1,
  parent = null,
  inc = 1,
  currentLevel = 1
) {
  var totalItems = currentLevel * inc;
  var items = [];

  if (currentLevel <= levels) {
    for (let i = 0; i < totalItems; i++) {
      const parentId = parent ? parent.get('id') : '0';
      const parentIdNum = parentId.charAt(parentId.length - 1);
      const itemId = currentLevel + parentIdNum + i;

      const taxonomyItem = TaxonomyItem.create({
        id: `${parentId}-${itemId}`,
        code: `Code : ${currentLevel} : ${parentIdNum} : ${i}`,
        title: `Item : ${currentLevel} : ${parentIdNum} : ${i}`,
        level: currentLevel,
        parent: parent
      });

      generateTaxonomyTestTree(levels, taxonomyItem, inc, currentLevel + 1);
      items.push(taxonomyItem);
    }

    if (parent) {
      // Link all items to parent
      parent.set('children', items);
    }

    return items;
  }
}

/**
 * Generates a tree data structure for testing the browse selector (@see gru-browse-selector)
 * @param {Number} levels - total number of parent/children levels in the tree
 * @param {Number} lastLevels - number of sub-levels in the last level of the tree
 * @param {Number} inc - number by which the number of items in each level will increase
 * @return {BrowseItem[][] ...} - the list of browse items in the first level
 */
export function generateBrowseTestTree(levels = 1, lastLevels = 0, inc = 1) {
  const startLevel = 1;
  var browseItems = [];

  var taxonomyItems = generateTaxonomyTestTree(
    levels + lastLevels,
    null,
    inc,
    startLevel
  );

  taxonomyItems.forEach(function(rootTaxonomyItem) {
    var item = BrowseItem.createFromTaxonomyItem(
      rootTaxonomyItem,
      levels + lastLevels
    );
    browseItems.push(item);
  });

  return browseItems;
}

/**
 * Gets a category object from a subjectId
 * @param {String} subjectId - The subject id with the format 'CCSS.K12.Math'
 * @return {Object} - An object with the category information
 */
export function getCategoryFromSubjectId(subjectId) {
  var result = TAXONOMY_CATEGORIES[0].value; // Default to K12 category
  if (subjectId) {
    const keys = subjectId.split('.');
    if (keys.length > 1) {
      const categoryCode = keys[1];
      for (var i = TAXONOMY_CATEGORIES.length - 1; i >= 0; i--) {
        // The second part of the subjectId represents the category
        if (categoryCode === TAXONOMY_CATEGORIES[i].apiCode) {
          result = TAXONOMY_CATEGORIES[i].value;
          break;
        }
      }
    }
  }
  return result;
}
