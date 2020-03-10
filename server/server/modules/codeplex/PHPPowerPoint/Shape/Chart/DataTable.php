<?php
/**
 * PHPPowerPoint
 *
 * Copyright (c) 2009 - 2010 PHPPowerPoint
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @category   PHPPowerPoint
 * @package    PHPPowerPoint_Shape_Chart
 * @copyright  Copyright (c) 2009 - 2010 PHPPowerPoint (http://www.codeplex.com/PHPPowerPoint)
 * @license    http://www.gnu.org/licenses/old-licenses/lgpl-2.1.txt	LGPL
 * @version    ##VERSION##, ##DATE##
 */


/**
 * PHPPowerPoint_Shape_Chart_Axis
 *
 * @category   PHPPowerPoint
 * @package    PHPPowerPoint_Shape_Chart
 * @copyright  Copyright (c) 2009 - 2010 PHPPowerPoint (http://www.codeplex.com/PHPPowerPoint)
 */
class PHPPowerPoint_Shape_Chart_DataTable implements PHPPowerPoint_IComparable
{	
	/**
	 * Horz Border
	 *
	 * @var boolean
	 */
	private $_showHorzBorder = true;
	private $_showVertBorder = true;
	private $_showOutline = true;
	private $_showKeys = true;

    /**
     * Create a new PHPPowerPoint_Shape_Chart_Axis instance
     * 
     * @param string $title Title
     */
    public function __construct()
    {
    }
    
	/**
	 * Get Title
	 *
	 * @return string
	 */
	public function getShowHorzBorder() {
	        return $this->_showHorzBorder;
	}
	
	/**
	 * Set Title
	 *
	 * @param string $value
	 * @return PHPPowerPoint_Shape_Chart_Axis
	 */
	public function setShowHorzBorder($value = true) {
	        $this->_showHorzBorder = $value;
	        return $this;
	}
	
	public function getShowVertBorder() {
	        return $this->_showVertBorder;
	}
	public function setShowVertBorder($value = true) {
	        $this->_showVertBorder = $value;
	        return $this;
	}
	public function getShowOutline() {
	        return $this->_showOutline;
	}
	public function setShowOutline($value = true) {
	        $this->_showOutline = $value;
	        return $this;
	}
	public function getShowKeys() {
	        return $this->_showKeys;
	}
	public function setShowKeys($value = true) {
	        $this->_showKeys = $value;
	        return $this;
	}
	/**
	 * Get hash code
	 *
	 * @return string	Hash code
	 */
	public function getHashCode() {
    	return md5(
    		  ($this->_showHorzBorder ? 't' : 'f')
    		. ($this->_showVertBorder ? 't' : 'f')
    		. ($this->_showOutline ? 't' : 'f')
    		. ($this->_showKeys ? 't' : 'f')
    		. __CLASS__
    	);
    }

    /**
     * Hash index
     *
     * @var string
     */
    private $_hashIndex;

	/**
	 * Get hash index
	 *
	 * Note that this index may vary during script execution! Only reliable moment is
	 * while doing a write of a workbook and when changes are not allowed.
	 *
	 * @return string	Hash index
	 */
	public function getHashIndex() {
		return $this->_hashIndex;
	}

	/**
	 * Set hash index
	 *
	 * Note that this index may vary during script execution! Only reliable moment is
	 * while doing a write of a workbook and when changes are not allowed.
	 *
	 * @param string	$value	Hash index
	 */
	public function setHashIndex($value) {
		$this->_hashIndex = $value;
	}

	/**
	 * Implement PHP __clone to create a deep clone, not just a shallow copy.
	 */
	public function __clone() {
		$vars = get_object_vars($this);
		foreach ($vars as $key => $value) {
			if (is_object($value)) {
				$this->$key = clone $value;
			} else {
				$this->$key = $value;
			}
		}
	}
}